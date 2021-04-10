class RespondersController < ApplicationController
  before_action :authenticate_user, only: [ :index, :show, :create, :update]
  
  # GET /responders
  def index
    if params[:request_id] and params[:user_id]
       @responders = Responder.where(request_id: params[:request_id], user_id: params[:user_id])
       render json: @responders.as_json(include: {user: { only: [:id,:first_name,:last_name] },
                                        request:{only:[:id, :user_id, :description, :rtype]}})
    end

    if params[:request_id] and params[:volunteer]
        @responders = Responder.where(request_id: params[:request_id]).where(volunteer: TRUE)
        render json: @responders 
    end
 
    #@responders=Responder.includes(:user,:request)
    if params[:userID]
       #@responders = Responder.includes(:user,:request).where(requests: { user_id: params[:userID] })
       sql = "SELECT 
       responders.request_id AS request_id, 
       users.first_name,
       users.last_name,     
       requests.description,
       requests.fullfilled,
       requests.user_id AS request_user_id,
       responders.user_id AS responder_user_id,
       responders.id AS responder_id,
       responders.volunteer AS volunteer,
       COALESCE(COUNT( conversations.unreaded = TRUE OR NULL),0)
       AS unreaded_message_count
       FROM responders 
       LEFT OUTER JOIN users ON users.id = responders.user_id 
       LEFT OUTER JOIN requests ON requests.id = responders.request_id 
       LEFT OUTER JOIN conversations ON conversations.responder_id = responders.id
       WHERE requests.user_id = #{params[:userID]}
       AND conversations.user_id = responders.user_id 
       GROUP BY responders.request_id,users.first_name,users.last_name,requests.description,requests.fullfilled
       ,requests.user_id,responders.user_id,responders.id,responders.volunteer ORDER BY responders.request_id"
         
       @responders = ActiveRecord::Base.connection.execute(sql)
       #render json: @responders.as_json(include: {request:{only:[:id]}},user: { only: [:first_name] }, only:[:id],user: { only: [:id,:last_name] }, :methods => :unreaded_message_count)
       render json: @responders.as_json( :methods => :unreaded_message_count)
    end
    #render json: @responders.as_json(include: {user: { only: [:id,:first_name,:last_name] }, request:{only:[:id, :user_id, :description, :rtype]}}, :methods => :unreaded_message_count)
    #render json: @responders.as_json(include: {conversation: {only: [:unreaded]}})
  end

  # GET /responders/1
  def show
    @responder = Responder.find_by_id(params[:id])
    render json: @responder
  end

  # POST /responders
  def create
    @responder = Responder.new(responder_params)
    if @responder.save
       render json: @responder, status: :created
    else
       Rails.logger.info(@responder.errors.messages.inspect)
       render json: @responder.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /responders/1
  def update
    @responder = Responder.find_by_id(params[:id])
    if @responder.update_attributes(volunteer: params[:state])
      render json: @responder
      #@user.update_attributes(first_name: params[:first_name], last_name: params[:last_name], lat: params[:lat], lng: params[:lng])
    else      
      Rails.logger.info(@responder.errors.messages.inspect)
      render json: @responder.errors, status: :unprocessable_entity
    end
  end

  private
  # Only allow a trusted parameter "white list" through.
  def responder_params
    params.permit(:request_id, :user_id, :volunteer)
  end
end
