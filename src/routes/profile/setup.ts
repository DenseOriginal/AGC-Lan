import { RequestHandler } from "express";
import { checkForDiscordRoles } from "../../discord/functions/check-for-roles";
import { isUserInServer } from "../../discord/functions/in-server";
import { verifyUser } from "../../discord/functions/verify-user";
import { PartialUserModel } from "../../models/partial-user";
import { IUser, UserModel } from "../../models/user";

// The info we want about the user
const infoToCollect = [
  { name: "firstname", placeholder: "Fornavn", value: "", error: "" },
  { name: "lastname", placeholder: "Efternavn", value: "", error: "" },
  { name: "class", placeholder: "Klasse (f. eks. 20HTXCR)", value: "", error: "", rest: 'list="classes" autocomplete="off"' },
];

// Regex to validate a klass
// 20HTXCR : Pass
// 2HTXCR : Fail
// 20CR : Fail
const classRegex = /\d\dHTX\w{1,4}/;

// On get send the setup page
// The info we want to collect is dynamicly rendered in the handlebars file
export const getSetup: RequestHandler = (req, res) => {
  res.status(200).render('profile/setup', { title: 'Setup', noHeader: true, infoToCollect })
};

// Post route used to handle the setup
export const postSetup: RequestHandler = async (req, res) => {
  // Extract the information from the body as strings
  const { firstname: first_name, lastname: last_name, class: klasse } = req.body as { [key: string]: string };

  // Copy the infoToCollect into errorMessage so that we can edit it
  // Use JSNON.parse(JSON.string(infoToCollect)) to deep copy the object, to avoid changing the original opbject
  // https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/#_3-using-json
  const errorMessage: typeof infoToCollect = JSON.parse(JSON.stringify(infoToCollect));
  
  // Check if the class passes the regex check
  // Text the uppercase value of klasse, because otherwise the regex gets mad
  // If not set an error
  if(!classRegex.test(klasse.toLocaleUpperCase())) errorMessage[2].error = "Klasse skal skrives som 20HTXCR";

  // Check if the information is valid
  // If not the set an error on the information
  if(!first_name) errorMessage[0].error = "Venligst udfyld dit fornavn";
  if(!last_name) errorMessage[1].error = "Venligst udfyld dit efternavn";
  if(!klasse) errorMessage[2].error = "Venligst udfyld din klasse";


  // Check if we have an error
  if(errorMessage.find(cur => cur.error)) {
    // Set the previously entered information in the errorMessage
    // So that the user doesn't need to enter the information again
    errorMessage[0].value = first_name;
    errorMessage[1].value = last_name;
    errorMessage[2].value = klasse;

    // Render the setup page with the errors
    return res.status(422).render('profile/setup', {
      title: 'Setup',
      noHeader: true,
      infoToCollect: errorMessage,
    });
  }

  // The setup information is valid, so we can create a new user

  // Extract the old information from the old user
  // req.user is a partialUser in this context
  const {
    email,
    is_email_verified,
    username,
    refresh_token,
    picture_url,
    discord_id,
    created_at,
    accent_color,
  } = req.user as IUser; // Wierd fuckery because otherwise typescript wan't to self destruct

  // Create the new user
  const newUser = new UserModel({
    first_name,
    last_name,
    class: (klasse as string).toLocaleUpperCase(),
    email,
    is_email_verified,
    username,
    refresh_token,
    picture_url,
    discord_id,
    created_at,
    setup_finished: true,
    accent_color
  });

  try {
    // Try to save the user
    await newUser.save();

    // If saving the user succedes, the delete the partial user
    await PartialUserModel.deleteOne({ discord_id: newUser.discord_id }).exec();

    // Manually set the req.user variable to the new user
    // Make sure to convert it to a normal object, to remove the mongoose model properties and methods
    req.user = newUser.toObject();

    // When the user has been setup verify the user
    verifyUser(newUser.discord_id).catch((e) => console.error('Verify error: ', e));
    checkForDiscordRoles(newUser).catch((e) => console.error('Check for roles error: ', e));

    if(!(await isUserInServer(newUser.discord_id))) return res.redirect('/discord');

    // Redirect the new use to ther profile page
    return res.redirect('/profile');
  } catch (error) {

    // TODO: implement better error handling
    // If an error happens log the error, and send status 500 (Internal server error)
    console.log(error);
    res.status(500).send('Internal server error');
  }
};