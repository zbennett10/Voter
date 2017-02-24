const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const moment = require('moment');
const Poll = mongoose.model('poll');
const User = require('../models/user');

describe('Poll Controller', () => {
    let user1, user2, poll1, poll2, poll3;

    beforeEach((done) => {
        user1 = new User({
            name: 'Zach',
            joinDate: moment().format()
        });

        user2 = new User({
            name: 'Josh',
            joinDate: moment().format()
        });

        poll1 = new Poll({
            title: 'Poll1', 
            options: ['trump', 'hilary'],
            description: 'description'
        });

        poll2 = new Poll({
            title: 'Poll2',
            options: ['trump', 'hilary'],
            description: 'description'
        });

        poll3 = new Poll({
            title: 'Poll3',
            options: ['trump', 'hilary'],
            description: 'description'
        });

        user1.polls.push(poll1);
        user1.polls.push(poll2);
        poll1.user = user1;
        poll2.user = user1;
        user2.polls.push(poll3);
        poll3.user = user2;
        
        Promise.all([poll1.save(), poll2.save(), poll3.save(), user1.save(),
                    user2.save()])
            .then(() => done());
    });

    it('index sends all available polls', (done) => {
        request(app)
            .get('/')
            .end((error, response) => {
                assert(response.body.length === 3);
                done();
            });
    });

    it('shows individual poll page', (done) => {
        const poll = new Poll({
            title: "Individual", 
            options: ['trump', 'hilary'],
            description: 'description'
        });
        poll.save()
            .then(() => {
                request(app)
                    .get('/poll/' + poll.id)
                    .end((error, response) => {
                        assert(response.body.title === 'Individual');
                        done();
                    });
            })
        
    })
});