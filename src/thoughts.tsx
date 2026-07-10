import mockData from './assets/mock.json'

type Thought = {
    id: number;
    content: string;
    timestamp: string
};


export function OneThought({thought} : {thought : Thought}) {
    return(
        <div className="border rounded p-2">
            <p className="font-roboto">{thought.content}</p>
            <small>{thought.timestamp}</small>
        </div>
    )
}




export default function DisplayThoughts(){

    return(
        <div className="flex flex-col gap-4 p-4 w-[50%] m-auto">
        {
            mockData.map((thought : Thought)=> (
                <OneThought thought={thought}/>
            ))
        }
        </div>
    )
}