import { auth,signOut} from "@/auth"

//server way auth
const SettingsPage =async()=>{
    const session = await auth();
    
    return(
        <><div>
            <h1>Settings Page</h1>
            {JSON.stringify(session)}
        </div><div>
                <form action ={async()=>{
                    "use server";
                    await signOut();
                }}>
                    <button type="submit">
                        Sign out
                    </button>
                </form>
            </div></>
    )
}

export default SettingsPage;