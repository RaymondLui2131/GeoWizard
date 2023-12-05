const AboutScreen = () => {
  return (
    <div className='max-h-[100%] min-h-screen bg-primary-GeoPurple'>
      <div className='px-32 py-6 font-NanumSquareNeoOTF-Lt text-white'>
        <h1 className='mb-6 text-center font-PyeongChangPeace-Light text-5xl text-primary-GeoBlue'>
          About Us
        </h1>
        <div className='mb-4 font-NanumSquareNeoOTF-Bd text-4xl text-primary-GeoOrange'>
          Welcome to GeoWizard - Your Gateway to the World of Maps!
        </div>
        <div className='mb-4 text-lg'>
          Our mission is to empower users to create, share, and edit maps based
          on real-world data, opening up a world of possibilities for
          exploration and collaboration.
        </div>

        <h2 className='mb-2 font-NanumSquareNeoOTF-Bd text-xl font-semibold text-primary-GeoOrange'>
          Here's What We Offer:
        </h2>
        <ol className='mb-4 list-decimal pl-8 text-lg'>
          <li className='mb-2'>
            {' '}
            <span className='font-NanumSquareNeoOTF-Bd'>
              Endless Exploration:{' '}
            </span>
            Dive into a diverse universe of maps created by our vibrant
            community. From geographical wonders to data-driven insights,
            GeoWizard offers a treasure trove of maps to explore.
          </li>
          <li className='mb-2'>
            {' '}
            <span className='font-NanumSquareNeoOTF-Bd'>
              Join the Conversation:{' '}
            </span>
            Engage in thought-provoking discussions about maps and their
            interpretations. Share your insights, ask questions, and learn from
            fellow map enthusiasts. GeoWizard is your digital forum for all
            things maps.
          </li>
          <li className='mb-2'>
            {' '}
            <span className='font-NanumSquareNeoOTF-Bd'>
              Unleash Your Creativity:{' '}
            </span>
            Feel inspired or have a unique perspective on an existing map? With
            GeoWizard, you can easily edit maps and publish your own forked
            versions, showcasing your creativity to the community.
          </li>
          <li className='mb-2'>
            {' '}
            <span className='font-NanumSquareNeoOTF-Bd'>
              User-Friendly Innovation:{' '}
            </span>{' '}
            Unlike other map editing applications that can be confusing and
            counterintuitive, GeoWizard was meticulously crafted to be intuitive
            and user-friendly. We believe that everyone, regardless of their
            background, should be able to interact with maps effortlessly.
          </li>
          <li className='mb-2'>
            {' '}
            <span className='font-NanumSquareNeoOTF-Bd'>
              Community-driven:{' '}
            </span>
            GeoWizard functions in a way similar to popular forum sites like
            Reddit. It's a space where users from diverse backgrounds can come
            together to share, discuss, and celebrate their love for maps.
          </li>
        </ol>

        <p className='mb-4 text-lg'>
          So, join us in celebrating the art and science of maps. Dive into the
          world of GeoWizard, where the map is not just a tool but a canvas for
          creativity, discussion, and exploration. We can't wait for you to
          experience the magic of maps through our application.
        </p>

        <p className='text-lg'>
          Thank you for choosing GeoWizard, and we look forward to having you as
          a part of our vibrant community!
        </p>

        <div className='mt-4 text-lg'>
          <p className='font-NanumSquareNeoOTF-Bd text-xl text-primary-GeoOrange'>
            Our Team Members:
          </p>
          <p>Jason Cheng, Ka Hui Wong, Raymond Lui, Jaden Wong</p>
        </div>
      </div>
    </div>
  )
}

export default AboutScreen
