const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  slug:{type:String,required:true,unique:true,lowercase:true,trim:true},
  listingType:{type:String,enum:["Sale","Rent","PG"],default:"Sale",index:true},
  propertyType:{type:String,enum:["Apartment","Villa","House","Plot","Row House","Penthouse","Office","Shop","Warehouse","Other"],default:"Apartment",index:true},
  bhk:{type:Number,min:0,index:true},
  bathrooms:{type:Number,min:0},
  balconies:{type:Number,min:0},
  area:{type:Number,min:0,index:true},
  areaUnit:{type:String,enum:["sqft","sqm","acre"],default:"sqft"},
  price:{type:Number,min:0,index:true},
  priceLabel:{type:String,trim:true},
  maintenance:{type:Number,min:0},
  furnishing:{type:String,enum:["Unfurnished","Semi-Furnished","Fully Furnished"],default:"Unfurnished"},
  floor:{type:Number,min:0},
  totalFloors:{type:Number,min:0},
  age:{type:Number,min:0},
  possession:{type:String,trim:true},
  reraNumber:{type:String,trim:true},
  description:{type:String,trim:true},
  amenities:[{type:String,trim:true}],
  images:[{url:{type:String,required:true},alt:{type:String,trim:true}}],
  location:{
    city:{type:String,default:"Pune",trim:true,index:true},
    locality:{type:String,trim:true,index:true},
    address:{type:String,trim:true},
    pincode:{type:String,trim:true},
    latitude:{type:Number},
    longitude:{type:Number}
  },
  seller:{
    name:{type:String,trim:true},
    phone:{type:String,trim:true},
    email:{type:String,trim:true},
    type:{type:String,enum:["Owner","Agent","Builder"],default:"Owner"}
  },
  status:{type:String,enum:["Draft","Pending","Published","Rejected","Sold","Rented"],default:"Pending",index:true},
  featured:{type:Boolean,default:false,index:true},
  verified:{type:Boolean,default:false,index:true},
  views:{type:Number,default:0,min:0},
  seo:{title:String,description:String,canonicalUrl:String}
},{timestamps:true});

propertySchema.index({title:"text",description:"text","location.locality":"text"});
propertySchema.index({"location.city":1,"location.locality":1,listingType:1,propertyType:1});
propertySchema.index({price:1,area:1});
module.exports=mongoose.model("Property",propertySchema);
