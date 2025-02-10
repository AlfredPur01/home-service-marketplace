import { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  category: {
    type: String,
  },
  address: {
    type: String,
  },
  available: {
    type: String,
  },
  contact: {
    type: String,
  },
  description: {
    type: String,
  },
  servicePhoto: [{
    type: String
  }]
});

const Service = models.Service || model("Service", ServiceSchema)

export default Service