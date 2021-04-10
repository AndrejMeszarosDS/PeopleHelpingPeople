class PasswordResetController < ApplicationController
    # send email from POST packet
    def create
        @password_reset_error = false
        if @user = User.find_by_email(params[:email])
            password=('0'..'9').to_a.shuffle.first(8).join
            if PasswordResetMailer.password_reset_email(@user,password).deliver_now
                if (@user.update_attributes(password: password))
                    render json: "mail sended", status: :ok
                    #puts @user.password
                else
                    Rails.logger.info(@user.errors.messages.inspect)
                    render json: "error", status: :unprocessable_entity
                end
            else
                render json: "error", status: :unprocessable_entity
            end
        else
            render json: "error", status: :unprocessable_entity
        end
    end
end
