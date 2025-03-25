import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "For domestic orders, standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery. International shipping may take 7-14 business days depending on the destination country."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn, unwashed items with original tags attached. Returns are free for domestic orders. To initiate a return, please visit your order history in your account or contact our customer service team."
    },
    {
      question: "How do I find my size?",
      answer: "We provide detailed size guides on each product page. For general guidance, you can visit our Size Guide page. If you're between sizes, we typically recommend sizing up for a more comfortable fit. Our customer service team is also available to help with specific sizing questions."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options and rates during checkout once you enter your shipping address."
    },
    {
      question: "Are your clothes ethically produced?",
      answer: "Yes, all MOONCHILD products are ethically manufactured. We work exclusively with factories that ensure fair wages and safe working conditions. Many of our items use organic, recycled, or sustainably sourced materials. You can learn more on our Sustainability page."
    },
    {
      question: "How do I care for my MOONCHILD items?",
      answer: "Care instructions are provided on the tags of each garment and on the product pages. Generally, we recommend washing in cold water and hanging to dry to preserve the quality and lifespan of your items. Delicate items may require hand washing or dry cleaning."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of placing them. After this window, orders are processed for shipping and cannot be changed. Please contact our customer service team immediately if you need to make changes to a recent order."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout. We use eco-friendly packaging materials and include a personalized note if requested."
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-12">
          Find answers to the most common questions about MOONCHILD products and services.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  className={`h-5 w-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div 
                className={`px-4 pb-4 transition-all duration-300 ${openIndex === index ? 'block' : 'hidden'}`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-3">Still have questions?</h2>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-custom-orange text-white px-6 py-3 rounded-md hover:bg-custom-orange/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;