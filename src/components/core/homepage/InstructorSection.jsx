import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='my-8 w-11/12 mx-auto pb-20'>
      <div className='flex lg:flex-row flex-col gap-20 items-center justify-center'>
        <div className='lg:w-[30%] w-[80%] relative z-0'>
          <div className='h-full w-full absolute bg-white -right-2 -bottom-2 z-[-1] shadow-lg shadow-blue-300'></div>
          <img
              src={Instructor}
              alt=""
          />
            
        </div>

        <div className='lg:w-[50%] w-[80%] flex flex-col gap-5'>
          <div className='text-4xl font-semobold lg:w-[60%] w-[100%] text-white'>
            Become an
            <HighlightText text={" Instructor"} />
          </div>

          <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex flex-row gap-2 items-center'>
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection
