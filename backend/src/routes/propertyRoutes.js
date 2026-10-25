const express=require("express");
const {getProperties,getPropertyBySlug,createProperty,updateProperty,deleteProperty}=require("../controllers/propertyController");
const router=express.Router();
router.get("/",getProperties);
router.post("/",createProperty);
router.get("/:slug",getPropertyBySlug);
router.put("/:id",updateProperty);
router.delete("/:id",deleteProperty);
module.exports=router;
