import { MongoClient } from "mongodb";
import Head from 'next/head'
import { Fragment } from "react";
import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
    return <Fragment>
        <Head>
            <title>React Meetups</title> 
            <meta name="description" content="Browse a huge list of highly React meetups!" />
        </Head>
        <MeetupList meetups={props.meetups} />
        </Fragment>;
}

// export async function getServerSideProps(context) {
//     const request = context.req;
//     const response = context.res;
//     //fetch data from an API
//     return {
//         props:{
//             meetup: DUMMY_METTUPS
//         }
//     };
// }

export async function getStaticProps() {
    //fetch data from an API
    const client = await MongoClient.connect("mongodb+srv://jere-quevedo:nOKwCNCgYmU1KUH6@atlascluster.eb8tpv9.mongodb.net/meetups?retryWrites=true&w=majority");
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection.find().toArray();
    
    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image:meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    };
}

export default HomePage;