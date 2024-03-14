const server = "https://sgsldh5134.execute-api.eu-west-1.amazonaws.com";


export const getArticles = async (token) =>{
    myHeaders = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      });

    fetch(`${server}`, {method:"GET", headers: myHeaders});
}