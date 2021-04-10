class PasswordResetMailer < ApplicationMailer
    default from: "agent.mag.2019@gmail.com"
 
    def password_reset_email(user,password)
      @user = user
      @password = password
      mail(to: @user.email, subject: "Welcome to My Awesome Site")
      end
end
