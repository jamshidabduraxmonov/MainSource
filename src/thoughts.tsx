
import {db} from './firebase.ts'
import {useState, useEffect} from 'react'
import {serverTimestamp, addDoc, collection, onSnapshot, doc, deleteDoc} from 'firebase/firestore'


type Thought = {
    id: string;
    content: string;
    timestamp: string
};


type ThoughtCardProps = {
    thought: Thought,
    deleteThought: (id: string) => Promise<void>
}

export function OneThought({thought, deleteThought} : ThoughtCardProps) {
   return(
    <div className="border border-white rounded p-2">
        <p className="font-roboto text-white">{thought.content}</p>
        <small>{thought.timestamp.toLocaleString()}</small>
        <button className="border" onClick={() => deleteThought(thought.id)}>Delete</button>
    </div>
   )
}




export default function DisplayThoughts(){

    const [content, setContent] = useState('');
    const [thoughtData, setThoughtData] = useState<Thought[]>([]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const finalData = {
        content,
        timestamp: serverTimestamp()
    }

    const handlePost = async()=> {
        const collectionRef = collection(db, 'thoughts');
        const docRef = await addDoc(collectionRef, finalData);
        console.log(docRef);
        setContent('');
    }



    useEffect(() => 
        {const unsub = onSnapshot(collection(db, 'thoughts'), (querySnapshot)=> {
        let temp: Thought[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            temp.push({id: doc.id, 
                content: data.content,
                timestamp: data.timestamp.toDate()
            })
            console.log("temp data: ", temp);
        });

        setThoughtData(temp);

        return()=> {
            unsub();
        }
    });

}, [db]
    );

    const deleteThought = async(id: string)=> {
        await deleteDoc(doc(db, "thoughts", id));
        console.log(`${id} is deleted`);
    }

    

    console.log("thoughtData: ", thoughtData);

    return(
        <div className="bg-zinc-950 text-white ">
            <div className="flex flex-col gap-4 p-4 w-[50%] m-auto">
            {
               thoughtData.map((thought)=> {
                return(<OneThought thought={thought} deleteThought={deleteThought}/>);
               })
            }
            </div>


            <div className="w-[100%] bg-zinc-950 sticky bottom-0 flex  rounded m-auto p-4">
                <textarea 
                className="text-white bg-zinc-800 border rounded m-auto w-[80%] p-2"
                id="comments"
                value={content}
                onChange={handleInput}
                placeholder="Any thoughts?......"
                />
                <button onClick={()=> handlePost()} className="border px-4 rounded">Post</button>
            </div>
        </div>
        
    )
}