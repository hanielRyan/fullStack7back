const router = require("express").Router();
const postModel = require("./postModel");
router.post("/createPost",async(req,res)=>{
      const post = req.body.post;
      const create = await postModel.create(post);
      await create.save();
      res.json("post created").status(200);
});

router.get("/:email",async(req,res)=>{
const email = req.params.email;
    const posts = await postModel.find({email}).exec();
    res.json(posts);

})

router.delete("/deletePost/:_id",async(req,res)=>{
const _id = req.params._id;
await postModel.deleteOne({_id}).exec();
res.json("post deleted").status(204);
})

router.get("/pending/:email",async(req,res)=>{
    const email = req.params.email;
     const pendingPosts = await postModel.find({email,status:"pending"}).exec();
     res.json(pendingPosts);
})

router.get("/done/:email",async(req,res)=>{
    const email = req.params.email;
    const donePosts = await postModel.find({email,status:"done"}).exec();
    res.json(donePosts);

})

router.get("/updateStatus/:_id",async(req,res)=>{
    try{
        const _id= req.params._id;
const post = await postModel.findOne({_id}).exec();
if(post.status == "pending"){
    post.status = "done";
    await post.save();
    res.status(200).json("post status updated");;
}else{
    post.status = "pending";
    await post.save();
    res.status(200).json("post status updated");
}

    }catch(err){
        console.log(err);
        res.status(500);
    }
    


})

module.exports = router;