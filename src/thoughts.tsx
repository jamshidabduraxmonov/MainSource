
import {db} from './firebase.ts'
import {useState, useEffect} from 'react'
import {serverTimestamp, addDoc, collection, onSnapshot, doc, deleteDoc, updateDoc} from 'firebase/firestore'


type Thought = {
    id: string;
    content: string;
    timestamp: string
};


type ThoughtCardProps = {
    thought: Thought,
    deleteThought: (id: string) => Promise<void>,
    editThought: (id: string, updateContent: string)=> Promise<void>
}

export function OneThought({thought, deleteThought, editThought} : ThoughtCardProps) {

    const [editable, setEditable] = useState(false);

    function editOn(){
        const temp = !editable;
        setEditable(temp);

        console.log("editable: ", editable);
    }

   const handleBlur = async (event: any) => {
        const updatedText = event.currentTarget.innerText.trim();

        editThought(thought.id, updatedText);
   }


   return(
    <div className=" rounded p-2">
        <div className="">
            <p contentEditable={`${editable}`} onBlur={handleBlur} suppressContentEditableWarning={true} className={`font-roboto text-white ${editable ? "border" : ""} p-2`}>{thought.content}</p>
            <small>{thought.timestamp.toLocaleString()}</small>
            <button className="border m-1" onClick={() => deleteThought(thought.id)}>Delete</button>
            <button className="border m-1" onClick={()=> editOn()}>Edit</button>
        </div>

    </div>
   )
}




export default function DisplayThoughts(){

    const [content, setContent] = useState('');
    const [thoughtData, setThoughtData] = useState<Thought[]>([]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

   

    

    const handlePost = async()=> {
        const collectionRef = collection(db, 'thoughts');
        let temp = content.trim();
        

        const finalData = {
        temp,
        timestamp: serverTimestamp()
    }

        if(temp !== ''){
            const docRef = await addDoc(collectionRef, finalData);
            console.log(docRef);
        }
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

    });

     return()=> {
            unsub();
        }

}, [db]
    );

    const deleteThought = async(id: string)=> {
        await deleteDoc(doc(db, "thoughts", id));
        console.log(`${id} is deleted`);
    }

    const editThought = async(id: string, updateContent : string) => {
        const documentRef = doc(db, 'thoughts', id);

        await updateDoc(documentRef, {
            content: updateContent
        });
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>)=> {
        console.log("Key pressed: ", event.key);
        if (event.key === "Enter" && !event.shiftKey){
            event.preventDefault();
            handlePost();
        }
    }

    console.log("thoughtData: ", thoughtData);
    console.log("content data: ", content);

    return(
        <div className="bg-zinc-950 text-white h-screen flex flex-col">
            <div className="flex-1 divide-y p-4 lg:w-[40%] w-[70%] md:w-[50%] m-auto overflow-y-auto scrollbar-thin [scrollbar-color:theme(colors.slate.700)_transparent]">
                    {
                        thoughtData.map((thought)=> {
                            return(<OneThought thought={thought} deleteThought={deleteThought} editThought={editThought}/>);
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
                onKeyDown={handleKeyDown}
                />
                <button onClick={()=> handlePost()} className="border px-4 rounded">Post</button>
            </div>
        </div>
        
    )
}