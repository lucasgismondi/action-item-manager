const express = require('express');
const app = express();
app.use(express.static(__dirname + '/action-item-manager/build'));

const { ObjectID } = require('mongodb');
const { ActionItem } = require('../model/actionItem');

module.exports = (app, authenticate) => {
    app.post('/action-item/create', authenticate, (req, res) => {
        const { teamID, title, description, dueDate } = req.body;

        const actionItem = new ActionItem({
            teamID,
            title,
            description,
            dueDate,
            dateCreated: '2019-01-01',
            userIDList: []
        });

        actionItem.save().then(
            actionItem => {
                res.send({ actionItem });
            },
            error => {
                res.status(400).send(error);
            }
        );
    });

    app.get('/action-item/:id', authenticate, (req, res) => {
        const { id } = req.params;

        if (!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        ActionItem.findById(id)
            .then(actionItem => {
                if (!actionItem) {
                    res.status(404).send();
                } else {
                    res.send({ actionItem });
                }
            })
            .catch(error => {
                res.status(500).send();
            });
    });

    app.patch('/action-item/:id', authenticate, (req, res) => {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;

        if (!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        ActionItem.findByIdAndUpdate(id, { title, description, dueDate })
            .then(actionItem => {
                if (!actionItem) {
                    res.status(404).send();
                } else {
                    res.status(200).send();
                }
            })
            .catch(error => {
                res.status(400).send();
            });
    });

    app.delete('/action-item/:id', authenticate, (req, res) => {
        const { id } = req.params;

        if (!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        ActionItem.findByIdAndRemove(id)
            .then(actionItem => {
                if (!actionItem) {
                    res.status(404).send();
                } else {
                    res.send({ actionItem });
                }
            })
            .catch(error => {
                res.status(500).send();
            });
    });

    app.get('/action-item/team/:id', authenticate, (req, res) => {
        const { id } = req.params;

        if (!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        ActionItem.find({ teamID: id }).then(
            actionItems => {
                res.status(200).send({ actionItems });
            },
            error => {
                res.status(500).send(error);
            }
        );
    });

    app.post('/action-item/current', authenticate, (req, res) => {
        const { teamList } = req.body;

        ActionItem.find({ teamID: { $in: teamList } }).then(
            actionItems => {
                res.status(200).send({ actionItems });
            },
            error => {
                res.status(500).send(error);
            }
        );
    });

    app.post('/action-item/complete/:id', authenticate, (req, res) => {});
};
