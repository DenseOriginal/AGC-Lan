import { RequestHandler } from "express";
import { PartialUserModel } from "../../models/partial-user";
import { IUser, UserModel } from "../../models/user";

const infoToCollect = [
  { name: "firstname", placeholder: "Fornavn", value: "", error: "" },
  { name: "lastname", placeholder: "Efternavn", value: "", error: "" },
  { name: "class", placeholder: "Klasse (f. eks. 20HTXCR)", value: "", error: "" },
];

const classRegex = /\d\dHTX\w{1,4}/;

export const getSetup: RequestHandler = (req, res) => {


  res.status(200).render('setup', { title: 'Setup', noHeader: true, infoToCollect })
};

export const postSetup: RequestHandler = async (req, res) => {
  const { firstname: first_name, lastname: last_name, class: klasse } = req.body as { [key: string]: string };
  const errorMessage: typeof infoToCollect = JSON.parse(JSON.stringify(infoToCollect));
  
  if(!classRegex.test(klasse.toLocaleUpperCase())) errorMessage[2].error = "Klasse skal skrives som 20HTXCR";

  if(!first_name) errorMessage[0].error = "Venligst udfyld dit fornavn";
  if(!last_name) errorMessage[1].error = "Venligst udfyld dit efternavn";
  if(!klasse) errorMessage[2].error = "Venligst udfyld din klasse";


  // We have an error so send that resposne
  if(errorMessage.find(cur => cur.error)) {
    errorMessage[0].value = first_name;
    errorMessage[1].value = last_name;
    errorMessage[2].value = klasse;

    return res.status(422).render('setup', {
      title: 'Setup',
      noHeader: true,
      infoToCollect: errorMessage,
    });
  }

  const {
    email,
    is_email_verified,
    username,
    refresh_token,
    picture_url,
    discord_id,
    created_at,
    accent_color,
  } = req.user as IUser;

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
    await newUser.save();
    await PartialUserModel.deleteOne({ discord_id: newUser.discord_id }).exec();
    req.user = newUser.toObject();
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};