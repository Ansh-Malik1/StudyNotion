import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/homepage/HighlightText'
import CTAButton from '../components/core/homepage/CTAButton'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/homepage/CodeBlocks'
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection'
import TimelineSection from "../components/core/homepage/TimelineSection"
import InstructorSection from '../components/core/homepage/InstructorSection'
import Footer from '../components/core/common/Footer'
const Home = () => {
  return (
    <div>
      <div className='w-11/12 relative mx-auto flex flex-col items-center justify-between text-white'>
        <Link to={'/signup'}>
            <div className='rounded-full bg-richblack-800 mx-auto font-bold text-richblack-200
            transition-all hover:scale-95 duration-200 w-fit p-1 mt-16 group shadow-sm shadow-richblack-400'>
                <div className='flex justify-center items-center gap-2 group-hover:bg-richblack-900 py-2 px-5 rounded-full'>
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
            </div>
        </Link>
        <div className=' flex gap-2 text-4xl font-bold mt-8 lg:flex-row flex-col items-center text-center'>
          <p>Empower your future with</p>
          <HighlightText text={"Coding Skills"}/>
        </div>
        <div className='text-richblack-200 w-[70%] text-lg text-center mt-3'>
          <p>With our online coding courses, you can learn at your own pace, from anywhere in the world, and 
            get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback
             from instructors</p>
        </div>

        <div className='flex gap-7 mt-8'>
          <CTAButton linkTo={'/signup'} active={true}>Learn More </CTAButton>
          <CTAButton linkTo={'/login'}> Book a demo </CTAButton>
        </div>

        <div className='shadow-blue-200 shadow-lg relative w-[80%] my-12 mx-auto z-0'>
          
          <video
          muted
          loop
          autoPlay
          className='w-fit'
          >
            <source src={Banner} type="video/mp4"></source>
          </video>
          <div className='w-full h-full absolute shadow-blue-200 shadow-lg bg-white -right-3 -bottom-3 z-[-1]'></div>
        </div>

        <div>
          <CodeBlocks 
          postion={'lg:flex-row flex-col'}
          heading={
            <div className='text-4xl font-semibold'>
              Unlock your <HighlightText text={"Coding Potential"}/> with our online courses
            </div>
          }
          subHeading={'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'}
          ctaBtn1={
            {
              text:"Try it yourself",
              linkTo:"/signup",
              active:true
            }
          }
          ctaBtn2={
            {
              text:"Learn More",
              linkTo:"/login",
              active:false
            }
          }
          codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n</html>`}
          codeColor={"text-yellow-25"}
          position={'lg:flex-row'}
          />
        </div>

        <div>
          <CodeBlocks 
          postion={'lg:flex-row'}
          heading={
            <div className='text-4xl font-semibold'>
              Start <HighlightText text={"coding in seconds"}/> 
            </div>
          }
          subHeading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
          ctaBtn1={
            {
              text:"Try it yourself",
              linkTo:"/signup",
              active:true
            }
          }
          ctaBtn2={
            {
              text:"Learn More",
              linkTo:"/login",
              active:false
            }
          }
          codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n</html>`}
          codeColor={"text-yellow-25"}
          position={'lg:flex-row-reverse'}
          />
        </div>
      </div>

      <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[310px]'>

                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white '>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>
            </div>

            <div className=' homepage_bg mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

                <div className='flex lg:flex-row flex-col gap-5 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get the Skills you need for a
                        <HighlightText text={" Job that is in demand"} />
                    </div>

                    <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                    <div className='text-[16px]'>
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>
                </div>
            </div>
            <TimelineSection/>
            <LearningLanguageSection/>
      </div>
      <InstructorSection/>
      <Footer/>
    </div>
  )
}

export default Home
