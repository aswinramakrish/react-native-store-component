
import React, { Component } from 'react';

export default class StoreComponent extends Component<{}> {
    constructor(props)
    {
        super(props);  
        
        this.state = {
            data: {},
            listeners: {}
        }

        this.set = this.set.bind(this);
        this.listen = this.listen.bind(this);
    }

    set(field, value, silent=false) {
        var data = this.state.data;

        if(typeof field == 'string')
        {
            data[field] = value;

            this.setState({
                data: data
            });

            if(!silent)
            {
                if (typeof this.state.listeners[field] == 'function')
                    this.state.listeners[field](value, field);
            }            
        }
        else{
            var listeners = Object.keys(this.state.listeners);
            var listenedFields = [];
            
            for (var i = 0; i < field.length; i++) {
                data[field[i]] = value[i];

                if(!silent)
                {
                    if(listeners.indexOf(field[i]) > -1)
                    listenedFields.push({ field: field[i], value: value[i] });
                }                
            }

            this.setState({
                data: data
            });
            
            if(!silent)
            {
                for(var i=0; i<listenedFields.length; i++)
                this.state.listeners[listenedFields[i].field](listenedFields[i].value, listenedFields[i].field);

                var joinedField = field.join('');
                if(typeof this.state.listeners[joinedField] == 'function')
                    this.state.listeners[joinedField](value, field);
            }            
        }
    }

    listen(field, callback, singleCallback=false){
        var listeners = this.state.listeners;
        
        if(typeof field == 'string')        
            listeners[field] = callback;                    
        else{
            if(singleCallback)
            {
                listeners[field.join('')] = callback;
            }
            else{
                for(var i=0; i<field.length; i++)
                {
                    listeners[field[i]] = callback;
                }            
            }            
        } 

        this.setState({
            listeners: listeners
        });
    }
}
