import nodemailer, {Transporter} from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import {promisify} from 'util'
import fs from 'fs'
import handlebars from 'handlebars'

class sendMail {
    private mailer: Transporter

    constructor() {
        this.mailer = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            secure: false,
            auth: {
                user: '0f5936733b0f43',
                pass: 'd336d59fdf3702',
            },
        })
    }

    public async execute(emails: string) {
        const readFile = promisify(fs.readFile)

        this.mailer.use('compile', hbs({
            viewEngine: {
                extname: '.edge',
            },
            viewPath: 'src/templates/default/emails',
            extName: '.edge',
        }))

        const html = await readFile('src/templates/emails/new_bet.edge', 'utf8')
        const template = handlebars.compile(html)
        const htmlToSend = template(template)

        this.mailer.sendMail({
            from: 'davi@email.com',
            to: emails,
            subject: 'Nova aposta',
            html: htmlToSend,
        }, (error) => {
            if (error) {
                console.log(error)
            }
            console.log('Successfully send email')
        })
    }
}

export default new sendMail();
