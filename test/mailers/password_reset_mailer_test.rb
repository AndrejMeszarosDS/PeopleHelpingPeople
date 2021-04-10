require 'test_helper'

class PasswordResetMailerTest < ActionMailer::TestCase

  setup do
    @user = User.create(:first_name => 'Firstname',
                        :last_name  => 'Lastname',
                        :email => 'test@example.com',
                        :password => 'password',
                        :lat => 22,
                        :lng => 11 )
  end
  
  test "password reset mail" do  
    email = PasswordResetMailer.password_reset_email(@user,@user.password).deliver_now
    
    assert_not ActionMailer::Base.deliveries.empty?
    
    assert_equal ["agent.mag.2019@gmail.com"], email.from  
    assert_equal [@user.email], email.to  
    assert_equal "Welcome to My Awesome Site", email.subject  
  end  

end
