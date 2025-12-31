plunc-js

The 2,314th frontend JavaScript framework… because the first 2,313 clearly weren’t enough 😎

### Example

Todo app -- the grand rite of passage for every JavaScript framework.
If your framework can survive a list of tasks without spontaneously combusting, congratulations: it's “real.”

Check out an example todo app here: https://jsbin.com/fitarogewo/edit?html,output

## Installation - CDN
PluncJS is currently available exclusively via the JSDelivr CDN. You can include it in your project by adding the following script tag to your HTML:
html
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/kenjiefx/plunc/dist/plunc.{version}.min.js"></script>
```
However, if you prefer to use the library in your Node.js bundle, you can download the library file directly from JSDelivr and include it in your project. 

## App Instance
A global variable will be available for creating an instance of the application. 
```html
<script type="text/javascript">
    const app = plunc.create('app')
</script>

<main plunc-app="app"></main>
<template plunc-name="app">
    Contents of the template will be rendered in the plunc-app element
</template>
```

### Components
PluncJS is designed with a component-based architecture, making it easy to build and manage complex applications. Each component encapsulates specific scope and functionality, making it easier to maintain and scale.
```html
<script type="text/javascript">
    app.component('ProfileCard', ($scope)=>{
        $scope.user = { fullName: 'John Doe' }
    })
</script>
<template plunc-name="ProfileCard">
    {{ user.fullName }} // Prints 'John Doe'
</template>
```
Components can be reused across different parts of the application, ensuring a modular and cohesive structure.
```html
<template plunc-name="app">
    <section plunc-component="ProfileCard"></section>
    <section plunc-component="Authors"></section>
</template>
<template plunc-name="Authors">
    <section plunc-component="ProfileCard"></section>
</template>
<template plunc-name="ProfileCard">
    {{ user.fullName }} // Prints 'John Doe'
</template>
```
### Services
Services are defined as objects with methods and properties that encapsulate specific functionality. They are designed to be injected into components, allowing different parts of the application to share and reuse code efficiently.
```html
<script type="text/javascript">
    app.service('UserDataService',()=>{
        console.log('this executes only once, despite multiple components using this')
        return {
            get: () => // implementation here,
            getAll: () => // implementation here,
        }
    })
    app.component('ProfileCard', ($scope, UserDataService)=>{
        $scope.user = UserDataService.get()
    })
    app.component('Authors', ($scope, UserDataService)=>{
        $scope.users = UserDataService.getAll()
    })
</script>
```
#### Singleton Nature of Services
A key characteristic of services is that they are instantiated only once and are shared across different components. This singleton pattern ensures that all components using the service interact with the same instance, maintaining a consistent state throughout the application.
#### Use Cases for Services
Services are ideal for scenarios where you need a single, shared instance of an object throughout the application. Some common use cases include:
* Maintain and manage the application state in a centralized manner.
* Handle API requests and responses, ensuring that all components have access to up-to-date data.
* Provide reusable utility functions that can be accessed by multiple components.
* Manage shared resources such as configuration settings, authentication tokens, or user data.

### Factories
Factories are essentially class references that can be used to create new instances of objects. They are defined as classes and can include methods and properties to encapsulate functionality.
```html
<script type="text/javascript">
    app.service('UserDataService',(UserFactory)=>{
        return {
            get: () => // implementation here involving UserFactor,
            getAll: () => // implementation here,
        }
    })
    app.factory('UserFactory',()=>{
        console.log('this executes only everytime this is used')
        class User {
            constructor(fullName){
                this.fullName = fullName
            }
        }
        return User
    })
    app.component('ProfileCard', ($scope, UserDataService, UserFactory)=>{
        $scope.user = new UserFactory
    })
    app.component('Authors', ($scope, UserDataService)=>{
        $scope.users = UserDataService.getAll()
    })
</script>
```
Factories are particularly useful in scenarios where you need a fresh instance of a class for each component. Some common use cases include:
* When each component requires its own instance of an object to manage state independently.
* When components need to initialize objects with different configurations or settings.
* When reusable components require customized instances of a class to tailor their behavior.

### Helpers
Helpers can create powerful, shared functionality that operates within the context of individual components. Helpers provide a flexible way to manage and manipulate component data and HTML, promoting code reuse and consistency across your application.
```html
<script type="text/javascript">
    app.helper('FormsHelper',($scope)=>{
        $scope.Forms = {
            state: 'active'
        }
    })
    app.component('ProfileCard', ($scope, UserDataService, UserFactory, FormsHelper)=>{
    })
    app.component('Authors', ($scope, UserDataService)=>{
    })
    <template plunc-name="Authors">
        <form plunc-disable="Forms.state"></form>
        <section plunc-component="ProfileCard"></section>
    </template>
    <template plunc-name="ProfileCard">
        <form plunc-disable="Forms.state"></form>
    </template>
</script>
```
### Caution and Best Practices
Since helpers can mutate components and their HTML, it is important to **use them carefully**. Improper use of helpers can lead to unexpected side effects and bugs. To mitigate risks, ensure that helpers have well-defined APIs and that their interactions with the component scope and HTML are clearly documented and understood.
Helpers are ideal for scenarios where you need to share functionality between components that involves direct interaction with the component’s data and HTML. 

## Dependecy Injection
#### Services and Factories
Services and factories can inject each other as dependencies, allowing for even greater flexibility and modularity in your application. For instance, a service can depend on a factory to create instances of a class as needed, and a factory can use a service to access shared data or utilities.
#### Helpers
Helpers can inject services and factories as dependencies. Helpers can also inject other helpers, however, as helpers can mutate scopes of components, it is best advised that it should be injected by the component which are using them.
#### Components and children
Components can inject services, helpers, factories, and child components as dependencies, enabling them to utilize shared instances (services) or create new instances as needed (factories). However, both services and factories cannot inject other components, ensuring a clear separation of concerns and maintaining modularity.

## Parent Component Injection
Components cannot directly inject their parent's name. This restriction exists because all components can use other components as their child components. The component injector would not know which specific parent instance it is referring to. 

Instead of directly injecting the parent component by name, you should use the special `$parent` API, as it will be dynamically resolved by the injector based on the specific parent instance of the component. This ensures that the child component always references the correct parent, even in complex nested structures.

