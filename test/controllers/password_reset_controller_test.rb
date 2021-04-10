require 'test_helper'

class PasswordResetControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.create(:first_name => 'Firstname',
                        :last_name  => 'Lastname',
                        :email => 'test@example.com',
                        :password => 'password',
                        :lat => 22,
                        :lng => 11 )
    @old_password = @user.password
  end

  test 'password reset should change password' do
    post '/api/password_reset', params: {email: 'test@example.com'}
    assert_response :success
    assert_not_equal(@old_password, User.first.password)
  end

end
