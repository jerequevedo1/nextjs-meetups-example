import { MongoClient, ObjectId} from 'mongodb'
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetailsPage(props) {

    return <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
    />;
}

export async function getStaticProps(context) {
    //fetch data from an API
    const meetupId = context.params.meetupId;    

    const client = await MongoClient.connect("mongodb+srv://jere-quevedo:nOKwCNCgYmU1KUH6@atlascluster.eb8tpv9.mongodb.net/meetups?retryWrites=true&w=majority");
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});
    
    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
        }
    };
}

export async function getStaticPaths() {
    const client = await MongoClient.connect("mongodb+srv://jere-quevedo:nOKwCNCgYmU1KUH6@atlascluster.eb8tpv9.mongodb.net/meetups?retryWrites=true&w=majority");
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection.find({},{_id:1}).toArray();
    
    client.close();

    return {
        paths: meetups.map(meetup => ({params: {meetupId: meetup._id.toString()}})),
        fallback: false
    };
}

export default MeetupDetailsPage;