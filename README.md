## A Store component for React Native

I created this component because I wanted to do some simple state manipulation at the parent level from children and other components and I felt like I could re-use this kind of component in many places in my application. So I whipped this up fairly quickly. 

I'm using this primarily in an application that has a lot of user entry forms which has sub-components that are being shared / re-used in other components.

So I use this instead of having a massive library like `Redux` and managing several Stores, Actions, Reducers etc. To me, it's very simplistic and gets the job done.

# What does it do
It helps with the following -
1. Adds a data and listener object to your `React component` that can then be easily passed to the children
2. Allows multiple assignments
3. You can easily listen to changes or suppress listener callback
4. You can have a single callback while listening to multiple fields

# Usage
Copy the `StoreComponent` code to your project and just inherit it as follows 

```javascript
import React, { Component } from 'react';
import StoreComponent from '<StoreComponent_Location>'

export default class YourComponent extends StoreComponent {
    constructor(props)
    {
        super(props)

        this.state = {
            ...this.state, // You need this line to be able to pass store component's state vars
            // Your component state vars here
        }
    }
}
```

`YourComponent` will have a `data` state variable. You can pass the `set` and `listen` functions to the child components as props to set the data variable, which can then be sent to the server for processing / form submission.

For example -

```javascript
// From YourComponent
<ChildComponent set={this.set} listen={this.listen}>
```

```javascript
// From ChildComponent
<SubChildComponent set={this.props.set} listen={this.props.listen}>
```

```javascript
// From SubChildComponent
<SubSubChildComponent set={this.props.set} listen={this.props.listen}>
```

You get the point..

# Things you can do

1. Set the `data` state variable at the parent level / at the component that inherits from `StoreComponent` (obviously by `this.setState()`) or with `this.set()`. So if you have a form that collects user information. You'd do something like the following -

```javascript
this.set('Name', 'John Doe')
this.set('Phone', '1234')
this.set('Email', 'john.doe@gmail.com')
```

2. If you have a child component that collects location information for example, you can do the following -

```javascript
<LocationComponent set={this.set.bind(this)} listen={this.listen.bind(this)} />
```

In the `LocationComponent`, you can set `data` as follows -

```javascript
this.props.set('Latitude', 40.000)
this.props.set('Longitude', -104.000)
```

3. If you have a modal for example, you can pass `set` prop and `listen` to it as well. 

For example, with something like `react-native-navigation`, you'd do the following -

```javascript
Navigation.showModal({
    screen: 'LocationComponent',
    title: 'My Location',
    passProps: {    
        set: this.set.bind(this),
        listen: this.listen.bind(this) // this is optional    
    },
    backButtonHidden: false,
    animated: true
});
```

Once you set the data as shown in use case 2 in the `LocationComponent` (or the modal), you'd listen for the change (in the parent or any other component used within the parent) like this -

```javascript
this.props.listen(['Latitude', 'Longitude'], function (value, field) {
    // value returned as an array as 'Latitude' and 'Longitude'    
}, singleCallback = true);
```

Use `singleCallback` to tell the listener to return 1 single callback. You can ignore that field or set it to false to return callbacks for every single field passed in as the array to listen.

You can also listen to 1 field by doing the following -

```javascript
this.props.listen('Latitude', function(value, field){
    // value for 'Latitude'
})
```

4. You can do a multi-set of values (similar to `AsyncStorage` but not that similar) -

```javascript
this.props.set(['Latitude', 'Longitude' /*  ...Other fields */], 
                        [latitude, longitude]);
```

5. When you want to submit your form from the parent component which has aggregated `data` set by child components. You just use `this.state.data`, which would look like the following.

```javascript
{
    'Name': 'John Doe',
    'Email': 'john.doe@gmail.com',
    'Phone': '1234',
    'Latitude': 40.000,
    'Longitude': -104.000,
    // Other fields set by other components now available at the parent
}
```

# Pros
1. Extremely simple to implement and use
2. Avoid massive `switch` statements to simply set a state from a child component
3. Less than 100 lines of code as opposed to a massive state management library

### NOTE: YMMV