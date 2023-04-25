<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/rinaldilucas/mean-stack-template">
    <img src="./app/assets/images/_readme/logo.png" alt="Logo">
  </a>

  <h3 align="center">MEAN Stack Crud Template</h3>

  <p align="center">
    Project built using Angular, NodeJS, Express.js<br> and MongoDB to jumpstart your studies!
    <br />
    <a href="https://github.com/rinaldilucas/mean-stack-template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#donations">Donate</a>       
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#donations">Donations</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">

[![Project Screenshot][project-screenshot]](https://rinaldilucas.github.io/mean-stack-template/)

</div>

I built this project to make a cool template for those who wants to learn the MEAN stack. If this repository helped you, don't hesitate to leave a star!<br><br>It has really cool features like:

-   Multilingual features implemented in both the client-side and API responses
-   Task module with Lazy Loading feature built-in
-   Virtual scrolling feature implemented on tables
-   Search and ordering features via the database to minimize requests
-   AJAX requests used for pagination
-   JWT implementation with passport
-   Authentication and role guard features added
-   Validation implemented on the client-side, API, routes, and database models, making it easy to reuse on other applications, whether using only the frontend, backend, or database
-   API error handling improved to enhance error readability using third-party software
-   Minimalist error handlers implemented throughout the project to improve readability and correctly throw HTTP errors and messages where possible
-   Async validation via pipe to determine whether the user is already registered or not
-   Custom pipes used to convert date to a selected language
-   Interceptor modules added to verify bearer token, errors, and headers language
-   Password encryption feature implemented
-   Redis blacklist feature added
-   Node.js API written with TypeScript
-   Dark mode feature added
-   An SCSS method used that utilizes REMs to maintain size scales
-   SCSS written using BEM methodology
-   Improved SCSS structure to improve reusability
-   Material components rewritten to support REM and improve mobile and table compatibility with minimum code
-   Improved readability on media queries through some functions
-   Examples added with mat-chips, mat-autocomplete, and more
-   Interfaces added for queries results to improve code reusability
-   Custom TSLint rules implemented that work on both the client-side and API
-   Middleware examples added
-   Routed bottom sheet example implemented using only one component
-   Input validators with multilingual features added
-   Prettier rules implemented to improve code readability
-   Insomnia routes exported with automatic generation of bearer token to easily use the routes

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This section shows what technologies are used in this particular project.

-   [MongoDB](https://www.mongodb.com/)
-   [Express.js](https://expressjs.com/)
-   [Angular 9](https://angular.io/)
-   [NodeJS](https://nodejs.org/en/)
-   [Redis](https://redis.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

After cloning the project, you need to do a few things to be able to run it.

### Prerequisites

You need to have the following requirements:

-   mongodb <a target="_blank" href="https://www.mongodb.com/try/download/community/">(download here)</a>
-   node 10 <a target="_blank" href="https://nodejs.org/en/download/">(download here)</a>

-   npm
    ```sh
    npm install -g npm
    ```
-   angular cli
    ```sh
    npm install -g @angular/cli@^9.1.0
    ```
-   nodemon
    ```sh
    npm install -g nodemon
    ```
-   npm run all
    ```sh
    npm install -g npm-run-all
    ```

### Installation

_Below is an example of how you can run the project._

1. Clone the repo
    ```sh
    git clone https://github.com/rinaldilucas/mean-stack-template.git
    ```
2. Install NPM packages via yarn
    ```sh
    yarn install
    ```
3. Create a database named `meantemplatedb`
4. Create collections named users, tasks, categories (or import from `./db/collections`)
5. Run angular, express and mongoDB as development mode
    ```js
    yarn dev
    ```
6. Build the dist folders
    ```js
    yarn build
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

You can import the Insomnia routes via file `./db/routes-collection.json` and import the mongodb collections via file `./db/colletions`. And below are the implemented routes. You also can consult them inside `./api/routes` folder.

```js
-------------------------------
-------- [USER ROUTES] --------
-------------------------------
[GET] localhost:3000/api/users -> 'findAll'
[GET] localhost:3000/api/users/:_id -> 'findOne'
[GET] localhost:3000/api/users/email/:email -> 'findOneByEmail'
[PUT] localhost:3000/api/users -> 'update'
[POST] localhost:3000/api/users/register -> 'register'
[POST] localhost:3000/api/users/authenticate -> 'authenticate'
[PUT] localhost:3000/api/users/changePassword -> 'changePassword'
[POST] localhost:3000/api/users/logout -> 'logout'
```

```js
-------------------------------
-------- [TASK ROUTES] --------
-------------------------------
[GET] localhost:3000/api/tasks/user/:userId -> 'findAllByUser'
[GET] localhost:3000/api/tasks/:_id -> 'findOne'
[POST] localhost:3000/api/tasks -> 'create'
[PUT] localhost:3000/api/tasks -> 'update'
[DELETE] localhost:3000/api/tasks/:_id -> 'remove'
```

```js
-------------------------------
------ [CATEGORY ROUTES] ------
-------------------------------
[GET] localhost:3000/api/categories -> 'findAll'
[POST] localhost:3000/api/categories -> 'create'
[DELETE] localhost:3000/api/categories/:_id -> 'remove'
```

If needed, you can debug express using `yarn api-debug`. <br>More builds scripts at `./package.json`.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![Website](https://img.shields.io/badge/-Website-0078D4?style=flat-square&logo=html5&logoColor=white&link=https://lucasreinaldi.com.br)](https://rinaldilucas.com)
[![Github](https://img.shields.io/badge/-Github-967bb5?style=flat-square&labelColor=967bb5&logo=github&logoColor=white&link=https://github.com/rinaldilucas)](https://github.com/rinaldilucas)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:lucasreinaldi@gmail.com)](mailto:lucasreinaldi@gmail.com)
[![Hotmail Badge](https://img.shields.io/badge/-Hotmail-0078D4?style=flat-square&logo=microsoft-outlook&logoColor=white&link=mailto:lucasreinaldi@hotmail.com)](mailto:lucasreinaldi@hotmail.com)
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/rinaldilucas/)](https://www.linkedin.com/in/rinaldilucas/)
[![Telegram Badge](https://img.shields.io/badge/-Telegram-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=telegram&logoColor=white&link=https://t.me/rinaldilucas)](https://t.me/rinaldilucas)

Project Link: [https://github.com/rinaldilucas/mean-stack-template](https://github.com/rinaldilucas/mean-stack-template)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Donations

If you feel that this project has helped you in any way, whether it's attracting clients or teaching you about the technologies used, feel free to make a donation.
It helps me a lot to continue developing open source codes.

-   Metamask (USDT):
    ```sh
    0xA0410641515F06fF6a9AdAFf1c3e90a3905ba271
    ```
-   PIX (BRL):
    ```sh
    72140bc8-fadc-42f5-abb6-9c13cc80a59f
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/rinaldilucas/mean-stack-template.svg?style=for-the-badge
[contributors-url]: https://github.com/rinaldilucas/mean-stack-template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rinaldilucas/mean-stack-template.svg?style=for-the-badge
[forks-url]: https://github.com/rinaldilucas/mean-stack-template/network/members
[stars-shield]: https://img.shields.io/github/stars/rinaldilucas/mean-stack-template.svg?style=for-the-badge
[stars-url]: https://github.com/rinaldilucas/mean-stack-template/stargazers
[license-shield]: https://img.shields.io/github/license/rinaldilucas/mean-stack-template.svg?style=for-the-badge
[license-url]: https://github.com/rinaldilucas/mean-stack-template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/rinaldilucas/
[project-screenshot]: ./app/assets/images/_readme/screenshot.gif
