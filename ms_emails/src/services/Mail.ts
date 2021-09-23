import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { promisify } from 'util';
import fs from 'fs';
import handlebars from 'handlebars';

const sendMail = async (emails: string) => {
    const readFile = promisify(fs.readFile);

    const mailer = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
            user: '0f5936733b0f43',
            pass: 'd336d59fdf3702',
        },
    });

    mailer.use('compile', hbs({
        viewEngine: {
            extname: '.edge',
        },
        viewPath: 'src/templates/deafult/emails',
        extName: '.edge',
    }));

    const html = await readFile('./src/templates/default/emails/new_bet.edge', 'utf8');
    const template = handlebars.compile(html);
    const htmlToSend = template(template);

    mailer.sendMail({
        from: 'Your name username@domain.com',
        to: emails,
        subject: 'New Bet',
        html: htmlToSend,
    }, (error) => {
        if (error) {
            console.log(error);
        }
        console.log('Email send successed to you email.');
    });
};

export default sendMail;
