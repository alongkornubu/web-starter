const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' // default
let selectedId = ''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    console.log('id', id)
    if (id) {
        mode = 'EDIT'
        selectedId = id

        // 1. เราจะดึงข้อมูล user เก่าออกมาก่อน
        try {
          const response = await axios.get(`${BASE_URL}/users/${id}`)
          const user =  response.data
            let firstNameDOM = document.querySelector('input[name=firstname]')
            let lastNameDOM = document.querySelector('input[name=lastname]')
            let ageDOM = document.querySelector('input[name=age]')
            let descriptiontDOM = document.querySelector('textarea[name=description]')

            firstNameDOM.value = user.firstname
            lastNameDOM.value = user.lastname
            ageDOM.value = user.age 
            descriptiontDOM.value = user.description

            let genderDOM = document.querySelectorAll('input[name=gender]') 
            let interestDOMs = document.querySelectorAll('input[name=interest]') 

        } catch (error) {
            console.log('error', error)
        }

        //2. เราจะนำข้อมูล user กลับใส่เข้าไปใน input html


    }
}

const validateData = (userData) => {
 let errors = []

     if (!userData.firstname) {
        errors.push('กรุณาใส่ชื่อจริง')
     }

     if (!userData.lastname) {
        errors.push('กรุณาใส่นามสกุล')
     }
     if (!userData.age) {
        errors.push('กรุณาใส่อายุ')
     }
     if (!userData.gender) {
        errors.push('กรุณาใส่เพศ')
     }

     if (!userData.interests) {
        errors.push('กรุณาใส่ความสนใจ')
     }

    if (!userData.description) {
        errors.push('กรุณาใส่รายละเอียดของคุณ')
    }

 return errors
}
const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')

    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}

    let descriptiontDOM = document.querySelector('textarea[name=description]')

    let messageDom  = document.getElementById('message')
    
    try {
        let interest = ''

        for (let i = 0; i < interestDOMs.length; i++) {
            interest += interestDOMs[i].value
            if(i != interestDOMs.length - 1) {
            interest += ', '
            }
        }
        
        console.log('test')
        let userData = {
            firstname: firstNameDOM.value,
            lastname: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            description: descriptiontDOM.value,
            interests: interest
        }

        console.log('submit data' ,userData)

        const errors = validateData(userData)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        const response = await axios.post(`${BASE_URL}/users`, userData)
        console.log('response', response.data)

        messageDom.innerText = 'บันทึกข้อมูลเรียบร้อย'
        messageDom.className = 'message success'

    } catch (error) {
        console.log('error message', error.message)
        console.log('error', error.errors)
        if(error.message) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }


        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</i>`
        }
        htmlData += '<ul>'
        htmlData += '</div>'

         messageDom.innerHTML = htmlData
         messageDom.className = 'message danger'
    }
}