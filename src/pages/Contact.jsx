import React from "react"

import Footer from "../components/common/Footer"
import ContactUsForm from "../components/core/ContactPage/ContactUsForm"
import ContactDetails from "../components/core/ContactPage/ContactDetails"
import ReviewSlider from "../components/common/ReviewSlider"
const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactUsForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        
      </div>
      <ReviewSlider/>
      <Footer />
    </div>
  )
}

export default Contact