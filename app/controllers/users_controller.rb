class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  before_action :authenticate_user, only: [ :index, :show, :update, :destroy]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1
  def show
    if (current_user.id === @user.id )
       #render json: @user
       render json: success_json(@user), status: :ok
    else
       render json: @user.errors, status: :unprocessable_entity
    end
       # puts user_params.keys
  end


  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      Rails.logger.info(@user.errors.messages.inspect)
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    @update_errors = false
    # first_name & last_name & lat & lng
    if !@user.update_attributes(first_name: params[:first_name], last_name: params[:last_name], lat: params[:lat], lng: params[:lng])
      @update_errors = true
    end
    # ID card if sended
    if !(params[:gaID] === "")
      if !@user.gaID.attach(params[:gaID])
        @update_errors = true
      end
    end
    # old password validation
    if !(params[:old_password] === "")
      if !(@user.authenticate(params[:old_password]))
        @update_errors = true
      else
        if !(@user.update_attributes(password: params[:password]))
          @update_errors = true
        end
      end
    end
    if @update_errors
      Rails.logger.info(@user.errors.messages.inspect)
      render json: @user.errors, status: :unprocessable_entity
    else
      render json: @user
    end
  end

  # DELETE /users/1
  def destroy
    @delete_errors = false    
    # old password validation
    if !(params[:old_password] === "")
      if !(@user.authenticate(params[:old_password]))
        @delete_errors = true
      else
        if !(@user.destroy)
          @delete_errors = true
        end
      end
    end
    if @delete_errors
      Rails.logger.info(@user.errors.messages.inspect)
      render json: @user.errors, status: :unprocessable_entity
    else
      render json: "OK",status: :ok
    end
  end

  private

  def success_json(user)
    {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        lat: user.lat,
        lng: user.lng,
        gaID: rails_blob_url(user.gaID)
    }
  end

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :gaID, :lat, :lng)
    end
end
