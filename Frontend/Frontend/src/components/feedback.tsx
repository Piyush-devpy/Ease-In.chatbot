interface FormProp{
    email:string,
    text:string
}


function Feedback(){
    return(
        <>
          <section className="">
            <h2 className="">Share Your Feedback!!</h2>
            <label className="">Email</label>
            <input type="email" name="email" placeholder="Email"/>
            <label className="">Name</label>
            <input type="text" name="name" placeholder="Name"/>
            <label className="">Feedback</label>
            
          </section>
        </>
    )
}