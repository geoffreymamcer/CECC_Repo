import mongoose from "mongoose";
import Product from "../models/Inventory";

const products = [
  {
    productName: "Basic Prescription Glasses",
    productType: "prescription glasses",
    productDescription:
      "Lightweight and durable prescription glasses for daily use.",
    productPrice: 1500,
    productCost: 1200,
    availableStocks: 30,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Anti Radiation Glasses",
    productType: "anti radiation glasses",
    productDescription:
      "Protect your eyes from harmful radiation emitted by screens.",
    productPrice: 1200,
    productCost: 900,
    availableStocks: 50,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Blue Light Blocking Glasses",
    productType: "anti blue light glasses",
    productDescription:
      "Reduces eye strain from screens and improves sleep quality.",
    productPrice: 1000,
    productCost: 750,
    availableStocks: 40,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Polarized Sunglasses",
    productType: "sunglasses",
    productDescription: "Stylish polarized sunglasses for outdoor protection.",
    productPrice: 2000,
    productCost: 1500,
    availableStocks: 25,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Lubricating Eye Drops",
    productType: "eye drops",
    productDescription: "Relieves dryness and irritation for sensitive eyes.",
    productPrice: 300,
    productCost: 200,
    availableStocks: 100,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Antibiotic Eye Ointment",
    productType: "eye ointments",
    productDescription: "Prevents and treats eye infections effectively.",
    productPrice: 450,
    productCost: 300,
    availableStocks: 60,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Vitamin Eye Supplement",
    productType: "eye supplements",
    productDescription: "Supports healthy vision and reduces eye fatigue.",
    productPrice: 700,
    productCost: 500,
    availableStocks: 80,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Daily Contact Lens",
    productType: "contact lens",
    productDescription: "Comfortable daily disposable contact lenses.",
    productPrice: 500,
    productCost: 350,
    availableStocks: 120,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Contact Lens Solution",
    productType: "contact lens solution",
    productDescription:
      "Cleans and disinfects your contact lenses effectively.",
    productPrice: 250,
    productCost: 150,
    availableStocks: 90,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Contact Lens Case",
    productType: "contact lens case",
    productDescription: "Durable and hygienic case for storing contact lenses.",
    productPrice: 100,
    productCost: 60,
    availableStocks: 150,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Kids Prescription Glasses",
    productType: "prescription glasses",
    productDescription: "Colorful and durable glasses for children.",
    productPrice: 1300,
    productCost: 1000,
    availableStocks: 20,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Luxury Sunglasses",
    productType: "sunglasses",
    productDescription: "High-end sunglasses with premium UV protection.",
    productPrice: 5000,
    productCost: 3500,
    availableStocks: 15,
    stocksStatus: "low",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Night Vision Anti Blue Light Glasses",
    productType: "anti blue light glasses",
    productDescription: "Enhances night vision and reduces digital eye strain.",
    productPrice: 1100,
    productCost: 850,
    availableStocks: 35,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Moisturizing Eye Drops",
    productType: "eye drops",
    productDescription: "Hydrates eyes and reduces redness.",
    productPrice: 350,
    productCost: 250,
    availableStocks: 70,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Soothing Eye Ointment",
    productType: "eye ointments",
    productDescription: "Relieves irritation and soothes tired eyes.",
    productPrice: 400,
    productCost: 300,
    availableStocks: 50,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Omega Eye Supplement",
    productType: "eye supplements",
    productDescription: "Supports eye health and prevents fatigue.",
    productPrice: 800,
    productCost: 600,
    availableStocks: 60,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Colored Contact Lens",
    productType: "contact lens",
    productDescription: "Enhance your look with safe colored lenses.",
    productPrice: 600,
    productCost: 400,
    availableStocks: 100,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Contact Lens Travel Kit",
    productType: "contact lens case",
    productDescription: "Compact case and solution for traveling.",
    productPrice: 150,
    productCost: 90,
    availableStocks: 80,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Designer Anti Radiation Glasses",
    productType: "anti radiation glasses",
    productDescription: "Protects eyes in style from radiation.",
    productPrice: 1300,
    productCost: 900,
    availableStocks: 40,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Sport Sunglasses",
    productType: "sunglasses",
    productDescription: "Lightweight and durable for outdoor sports.",
    productPrice: 2200,
    productCost: 1600,
    availableStocks: 30,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Refreshing Eye Drops",
    productType: "eye drops",
    productDescription:
      "Cool and refresh tired eyes after long hours of screen use.",
    productPrice: 320,
    productCost: 220,
    availableStocks: 60,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Premium Eye Ointment",
    productType: "eye ointments",
    productDescription: "Effective ointment for dry and irritated eyes.",
    productPrice: 500,
    productCost: 350,
    availableStocks: 45,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Advanced Eye Supplement",
    productType: "eye supplements",
    productDescription: "Supports retina and overall eye health.",
    productPrice: 950,
    productCost: 700,
    availableStocks: 55,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Monthly Contact Lens",
    productType: "contact lens",
    productDescription: "Durable monthly lenses for extended use.",
    productPrice: 800,
    productCost: 600,
    availableStocks: 70,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
  {
    productName: "Hygienic Contact Lens Case",
    productType: "contact lens case",
    productDescription: "Keeps lenses clean and safe.",
    productPrice: 120,
    productCost: 80,
    availableStocks: 100,
    stocksStatus: "in stock",
    productImage:
      "https://media.istockphoto.com/id/1385629448/photo/eyedrops-and-eye-glasses-against-blue-background.jpg?s=612x612&w=0&k=20&c=Tn9IToPScNNX3-wwS9SX2qGsQZf5re8qLFc9KJH3HFQ=",
  },
];

Product.insertMany(products)
  .then(() => console.log("25 products inserted successfully"))
  .catch((err) => console.error("Error inserting products:", err));
