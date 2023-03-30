const homePage=async function (req,res){
     
        let { page } = req.query;

    try {
        if (typeof page === 'undefined' || page < 1) {
            page = 1;
        }

        const resp = await axios.get(tvShowsAPI + `?page=${page}`);
        
        res.render('movies', { movies: resp.data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occured" });
    }
 }


 const getRegister=function(){
    res.render('register', { errors: null });
 }

 