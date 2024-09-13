const mailjet = require('node-mailjet');  

// Create Mailjet client with API key and secret
const mailjetClient = mailjet.apiConnect(
    process.env.id, 
    process.env.security_key
);

// Function to send task notification emails using Mailjet
const sendTaskNotification = async (email, taskTitle, action) => {
    console.log(email);
    const request = mailjetClient
        .post("send", { version: 'v3.1' })
        .request({
            "Messages": [
                {
                    From: {
                        Email: process.env.email,
                      },
                    "To": [
                        {
                            "Email": email,
                        }
                    ],
                    "Subject": `Task ${action}: ${taskTitle}`,
                    "TextPart": `The task "${taskTitle}" has been ${action}.`,
                    "HTMLPart": `<h3>Task Update: ${taskTitle}</h3><p>The task has been ${action}.</p>`,
                    "CustomID": "TaskNotification"
                }
            ]
        });

    try {
        const result = await request;
        console.log(result.body);
    } catch (err) {
        console.error('Error sending email via Mailjet:', err.statusCode, err.message);
    }
};


const notifyTaskUpdate = (taskId, action) => {
    const io = require('../server').io;
    io.emit('taskUpdated', { taskId, action });
};

const sendConfirmationEmail = async (email, username) => {
    const request = mailjetClient
        .post("send", { version: 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        Email: "abhishek.sharmaxyz05971@gmail.com",
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": username
                        }
                    ],
                    "Subject": "Confirm your email",
                    "TextPart": `Hi ${username}, please confirm your email by clicking the following link: [Confirmation Link]`,
                    "HTMLPart": `<h3>Hi ${username},</h3><p>Please confirm your email by clicking the following link: <a href="http://yourdomain.com/confirm-email?token=yourToken">Confirm Email</a></p>`,
                    "CustomID": "EmailConfirmation"
                }
            ]
        });

    try {
        const result = await request;
        console.log(result.body);
    } catch (err) {
        console.error('Error sending confirmation email via Mailjet:', err.statusCode, err.message);
    }
};

module.exports = { sendTaskNotification, sendConfirmationEmail ,notifyTaskUpdate};

