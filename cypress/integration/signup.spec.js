//import faker from '@faker-js/faker'

import signupPage from '../support/pages/signup'

describe('Cadastro', function () {

    context('Quando o usuário é novato', function () {
        const user = {
            name: 'Fernando Papito',
            //const email = faker.internet.email()
            email: 'papito@samuraibs.com',
            password: 'pwd123'
        }

        before(function () {
            cy.task('removeUser', user.email).then(function (result) {
                console.log(result)
            })
        })


        it('Cadastrar Usuário', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
           
            //cy.intercept('POST', '/users', {
            //    satusCode: 200
            //}).as('postUser')


            //cy.wait('@postUser')

        })
    })

    context('Quando o email já existe', function () {
        const user = {
            name: 'Fernando Papito',
            email: 'papito@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email).then(function (result) {
                console.log(result)
            })

            //fazendo a chamada direta na api
            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('Exibir email já cadastrado', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('Quando o email é incorreto', function(){
        const user = {
            name: 'Elizabeth Olsen',
            email: 'liza.yahoo.com',
            password: 'pwd123'
        }

        it('deve exibir mensagem de alerta', function(){
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
    
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('Quando a senha é muito curta', function(){
        
        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function(){
            signupPage.go()
        })

        passwords.forEach(function(p){
            it('não deve cadastrar com a senha: ' + p, function(){
               
                const user = {
                    name: 'Jason Friday',
                    email: 'jason@gmail.com',
                    password: p
                }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function(){
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context.only('Quando não preencho nenhum dos campos', function(){

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert){
            it('deve exibir ' + alert.toLowerCase(), function(){
                signupPage.alertHaveText(alert)
            })
        })
    })
})
//teste
