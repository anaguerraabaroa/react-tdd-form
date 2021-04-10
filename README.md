![Form](./src/images/form.png)

# **TDD Form with an API Request**

This form has been developed applying Test Driven Development with
[<img src = "https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black">](https://es.reactjs.org/),
[<img src = "https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">](https://jestjs.io/),
[<img src = "https://img.shields.io/badge/-Testing Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white">](https://testing-library.com/),
[<img src = "https://img.shields.io/badge/-Mock_Service_Worker-E95420?style=for-the-badge">](https://mswjs.io/)
and
[<img src = "https://img.shields.io/badge/-Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white">](https://material-ui.com/)

This exercise is part of the
[**Test Driven Development (TDD) en React JS**](https://www.udemy.com/course/tdd-react-js/?referralCode=F40803D2C4D2934AB038)
course.

**NOTE:** a mock server and an API rest have been used to develop this exercise.

## **Quick start guide**

Instructions to start this project:

### Installation

- Clone repository:

```
git clone [repository]
```

- Install NPM packages and dependencies:

```
npm install
```

- Run project on local server

```
npm start
```

### Tests

- Run tests:

```
npm run test
```

## **Project features**

**Store product**

As a merchandise manager, I want to store new products as a way of
administrating my products.

**Acceptance Criteria**

- There must be a create product form page.
- The form must have the following fields: name, size, type (electronic,
  furniture, clothing) and a submit button.
- All the fields are required.
  - If the user leaves empty fields and clicks the submit button, the form page
    must display required messages as the format: _“The [field name] is
    required”_ aside of the proper field.
  - If the user blurs a field that is empty, then the form must display the
    required message for that field.
- The form must send the data to a backend endpoint service.
  - The submit button should be disabbled while the form page is fetching the
    data. After fetching, the submit button does not have to be disabled.
  - In the success path, the form page must display the success message
    _“Product stored”_ and clean the fields values.
  - In a server error, the form page must display the error message _“Unexpected
    error, please try again”_.
  - In the invalid request path, the form page must display the error message
    _“The form is invalid, the fields [field1...fieldN] are required”_.
  - In the not found service path, the form page must display the message
    _“Connection error, please try later”_.

## **Folder Structure**

```
React TDD Form with an API Request
├── docs
├── node_modules
├── public
├── src
│   ├── const
│   │   └── httpStatus.js
│   ├── form
│   │    ├── Form.js
│   │    └── Form.test.js
│   ├── images
│   │    └── form.png
│   ├── services
│   │    └── productServices.js
│   ├── App
│   │── index.js
│   └── setupTests.js
|── .eslintrc
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
└── README.md
```
