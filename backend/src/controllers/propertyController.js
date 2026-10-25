const Property=require("../models/Property");

const slugify=(value)=>String(value||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

const getProperties=async(req,res)=>{
  try{
    const {listingType,propertyType,bhk,locality,minPrice,maxPrice,minArea,maxArea,furnishing,featured,search,sort="newest",page=1,limit=12}=req.query;
    const filter={status:"Published","location.city":"Pune"};
    if(listingType) filter.listingType=listingType;
    if(propertyType) filter.propertyType=propertyType;
    if(bhk) filter.bhk=Number(bhk);
    if(locality) filter["location.locality"]=new RegExp(locality,"i");
    if(furnishing) filter.furnishing=furnishing;
    if(featured!==undefined) filter.featured=featured==="true";
    if(minPrice||maxPrice){filter.price={};if(minPrice)filter.price.$gte=Number(minPrice);if(maxPrice)filter.price.$lte=Number(maxPrice);}
    if(minArea||maxArea){filter.area={};if(minArea)filter.area.$gte=Number(minArea);if(maxArea)filter.area.$lte=Number(maxArea);}
    if(search) filter.$text={$search:search};
    const currentPage=Math.max(Number(page),1),perPage=Math.min(Math.max(Number(limit),1),50),skip=(currentPage-1)*perPage;
    const sortMap={newest:{createdAt:-1},priceLow:{price:1},priceHigh:{price:-1},areaHigh:{area:-1},relevance:{featured:-1,verified:-1,createdAt:-1}};
    const [data,total]=await Promise.all([Property.find(filter).sort(sortMap[sort]||sortMap.newest).skip(skip).limit(perPage).lean(),Property.countDocuments(filter)]);
    res.json({success:true,data,pagination:{currentPage,perPage,total,totalPages:Math.ceil(total/perPage)}});
  }catch(error){res.status(500).json({success:false,message:"Failed to fetch properties",error:error.message});}
};

const getPropertyBySlug=async(req,res)=>{
  try{
    const property=await Property.findOne({slug:req.params.slug,status:"Published"});
    if(!property)return res.status(404).json({success:false,message:"Property not found"});
    await Property.updateOne({_id:property._id},{$inc:{views:1}});
    res.json({success:true,data:property});
  }catch(error){res.status(500).json({success:false,message:"Failed to fetch property",error:error.message});}
};

const createProperty=async(req,res)=>{
  try{
    const body={...req.body};
    body.slug=slugify(body.slug||body.title);
    body.location={...(body.location||{}),city:"Pune"};
    if(await Property.exists({slug:body.slug})) body.slug=body.slug+"-"+Date.now().toString().slice(-6);
    const property=await Property.create(body);
    res.status(201).json({success:true,data:property});
  }catch(error){res.status(400).json({success:false,message:"Failed to create property",error:error.message});}
};

const updateProperty=async(req,res)=>{
  try{
    const body={...req.body};
    if(body.title&&!body.slug) body.slug=slugify(body.title);
    if(body.location) body.location={...body.location,city:"Pune"};
    const property=await Property.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});
    if(!property)return res.status(404).json({success:false,message:"Property not found"});
    res.json({success:true,data:property});
  }catch(error){res.status(400).json({success:false,message:"Failed to update property",error:error.message});}
};

const deleteProperty=async(req,res)=>{
  try{const property=await Property.findByIdAndDelete(req.params.id);if(!property)return res.status(404).json({success:false,message:"Property not found"});res.json({success:true,message:"Property deleted"});}
  catch(error){res.status(500).json({success:false,message:"Failed to delete property",error:error.message});}
};

module.exports={getProperties,getPropertyBySlug,createProperty,updateProperty,deleteProperty};
