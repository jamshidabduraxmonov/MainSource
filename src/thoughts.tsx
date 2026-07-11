import mockData from './assets/mock.json'

type Thought = {
    id: number;
    content: string;
    timestamp: string
};


export function OneThought({thought} : {thought : Thought}) {
    return(
        <div className="border border-white rounded p-2">
            <p className="font-roboto text-white">{thought.content}</p>
            <small className="text-white">{thought.timestamp}</small>
        </div>
    )
}




export default function DisplayThoughts(){

    return(
        <div className="bg-zinc-950 text-white">
            <div className="flex flex-col gap-4 p-4 w-[50%] m-auto">
            {
                mockData.map((thought : Thought)=> (
                    <OneThought thought={thought}/>
                ))
            }
            </div>

            <div className="w-[100%] bg-zinc-950 sticky bottom-0 flex  rounded m-auto p-4">
                <textarea className="text-white bg-zinc-800 border rounded m-auto w-[80%] p-2"/>
                <button className="border px-4 rounded">Post</button>
            </div>
        </div>
        
    )
}