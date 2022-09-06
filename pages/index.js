import { MongoClient } from 'mongodb';
import Head from 'next/head';

import MeetupList from '../components/meetups/MeetupList';

export const getStaticProps = async () => {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default function Home(props) {
  return (
    <>
      <Head>
        <title>React Meetup</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}
