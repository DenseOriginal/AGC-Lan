import { LanModel } from "../../models/lan";

// Get the next lan, using this fuckery query
export async function getNextLan() {
  return (await LanModel.find({
    end: { $gt: new Date(), }
  }).sort({ end: "asc" }).limit(1).exec())[0];
}

// Convert the getNextlan() function to return an object, to get rid of mongoose stuff
export async function getNextLanAsObject() {
  return (await getNextLan())?.toObject();
}