const express=require('express');
const app=express();

const {descriptors,places}=require('./seedHelpers');
const data=require('./cities');

const mongoose = require('mongoose');

const Campground=require('../models/campground');
const { loadConfigFromFile } = require('vite');

const dbUrl=process.env.DB_URL;
// console.log(dbUrl);
main().catch(err => console.log(err));
// 'mongodb://127.0.0.1:27017/yelp-camp'
async function main() {
  await mongoose.connect('mongodb+srv://user-1:CyywqrBL0btc3KuH@cluster0.h1amifx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("mongo working")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample=arr=>arr[Math.floor(Math.random()*arr.length)];

const forinsertion= async()=>{
    console.log('chal to rha hai')
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        // const n_insert=new Campground(data[random1000]);
        const price=Math.floor(Math.random()*30)+10;
        const camp=new Campground({
            author:'660fee5488e88a79578f981e',
            location:`${data[random1000].city},${data[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251',
            description:'foiinrgoinbipngherbhgiuhehtbiubher9htheruhtguehbr8thguindhigishouifherobgoer',
            price,
            geometry: {
              type: 'Point',
              coordinates: [ data[random1000].longitude, data[random1000].latitude ]
            },
            images:[
              {
                url: 'https://res.cloudinary.com/dw38pkcpd/image/upload/v1712959998/YelpCamp/anan7criicjyrs66s9dk.png',
                filename:'YelpCamp/anan7criicjyrs66s9dk'
              },
              {
                url: 'https://res.cloudinary.com/dw38pkcpd/image/upload/v1712960005/YelpCamp/wfmbmkw1x8mu5iu0qoh9.png',
                _filename:'YelpCamp/wfmbmkw1x8mu5iu0qoh9'
              }
            ]
        });
        await camp.save();
    }
}
forinsertion().then(()=>{
    mongoose.connection.close();
})