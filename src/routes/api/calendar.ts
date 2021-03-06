import { RequestHandler } from "express";
import { isStaff } from "../../config/passport";
import { EventModel } from "../../models/event";
import { LanModel } from "../../models/lan";

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

// Help https://fullcalendar.io/docs/events-json-feed

export const getLanEventSource: RequestHandler = async (req, res) => {
  // The request params can contain a start time and an end time
  // The query should only contain stuff between the start and end
  const { start, end } = req.params;

  const allLan = await LanModel.find({
    start: {
      $gte: new Date(start || 0), // If we have a start time pass that in, otherwise set it to 0
      $lte: new Date(end || Date.now() * 2) // If twe have an end time use that, otherwise just pick a time lon in the future
    },
    public: true
  }).exec();

  res.send(JSON.stringify(
    allLan
      // Add one day to the end to make the calendar display it correctly
      .map(lan => { lan.end = new Date(lan.end.getTime() + 86400000 /* One day */); return lan })
      .map(lan => ({ title: lan.name, start: lan.start, end: lan.end, allDay: true }))
  ));
}

export const getEventEventSource: RequestHandler = async (req, res) => {
  // The request params can contain a start time and an end time
  // The query should only contain stuff between the start and end
  const { start, end } = req.params;

  const query = {
    start: {
      $gte: new Date(start || 0), // If we have a start time pass that in, otherwise set it to 0
      $lte: new Date(end || Date.now() * 2) // If twe have an end time use that, otherwise just pick a time lon in the future
    }
  };

  // If the user isn't a staff only query public events
  if(!isStaff(req.user)) (query as any).public = true;

  const allEvents = await EventModel.find(query).exec();

  res.send(JSON.stringify(allEvents));
}