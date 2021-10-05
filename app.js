const BASEURL = `https://api.github.com/users`;

const errorMessage = (status) =>{
    const messageDiv = document.querySelector('#message');
    let errmsg = ``;
    if(status===404){
        document.querySelector('.profile-card').style.display = 'none';
        document.querySelector('.github-cards').style.display = 'none';
        errmsg = `<div style="text-align: center; color: red; border:black; background-color: rgb(230, 148, 148); padding-top: 3rem; height: 2rem;">User profile doesn't exist</div>`;
    }
    messageDiv.innerHTML =errmsg;
    setTimeout(() => {
        messageDiv.innerHTML =``;
        document.querySelector('.profile-card').style.display = 'block';
        document.querySelector('.github-cards').style.display = 'flex';
    }, 5000);

}



const getGithubProfile = async (login) =>{
    try {
        const response =  await fetch(`${BASEURL}/${login}`);
    if(response.status !==200){
        if(response.status===404){
            errorMessage(response.status)
        }
        new Error(`Something went wrong! status code = ${response.status} `);
    }

    const data = await response.json();
    return data;
        
    } catch (error) {
        console.log(error);
    }
    

}

const getGithubRepos = async (login) => {
    try {
        const response =  await fetch(`${BASEURL}/${login}/repos`);
    if(response.status !==200){
        new Error(`Something went wrong! status code = ${response.status} `);
    }

    const data = await response.json();
    return data;
        
    } catch (error) {
        console.log(error);
    }
}



const renderProfile = (data) => {
    let profileSnippet=``;
    profileSnippet += 
                        `<div class="container">
                        <img src="${data.avatar_url}" alt="John" style="width:100%">
                        <h1> ${data.name}</h1>
                        <p>Email: ${data.email}</p>
                        <p>Followers: ${data.followers}</p>
                        <p>Following: ${data.following}</p>
                        <p>Company: ${data.company}</p>
                        <p>Bio: ${data.bio}</p>
                        </div>`

    document.querySelector('.profile-card').innerHTML = profileSnippet;
}

const renderRepos =(repos) =>{
    let repoList = ``;
    if(repos.length>0){
        repos.forEach((repo)=>{
            repoList += 
                            `<div class="github-card">
                            <h3>${repo.name}</h3>
                            <p><span>Description:</span> ${repo.description}</p>
                            <p><span>Language:</span> ${repo.language}</p>
                            <p><span>Size:</span> ${repo.size}</p>
                            <p><span>Watchers:</span> ${repo.watchers}</p>
                            <p><span>Forks:</span> ${repo.forks}</p>
                            <p><span>Licence:</span> ${repo.licence}</p>
                
                        </div>`
        })
    }

    document.querySelector('.github-cards').innerHTML = repoList;
}



document.addEventListener("DOMContentLoaded", () =>{
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const searchInput = document.querySelector('#search-input');
        const githubLogin = searchInput.value.trim();
        // console.log('login', githubLogin);
        if(githubLogin.length>0){
            const userProfile = await getGithubProfile(githubLogin);
            // console.log('profile', userProfile);
            if(userProfile.login){
                const gitRepos = await getGithubRepos(githubLogin);
                // console.log(gitRepos);
                renderProfile(userProfile);
                renderRepos(gitRepos);
            }
        }
    })
})