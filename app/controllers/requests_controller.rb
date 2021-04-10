class RequestsController < ApplicationController
  before_action :authenticate_user, only: [ :index, :show, :create, :update]
  
  # GET /requests
  def index
    if params[:userID]
      @requests = Request.where(fullfilled: FALSE)
                         .where(showOnMap: FALSE)
                         .where(user_id: params[:userID])

      render json: @requests.as_json(only: [:id, :updated_at])
    end
  

    if params[:min_lng] and params[:max_lng] and params[:min_lat] and params[:max_lat]
      @requests = Request.includes(:user,:responder)
                         .where("lng >= ?", params[:min_lng])
                         .where("lng <= ?", params[:max_lng])
                         .where("lat >= ?", params[:min_lat])
                         .where("lat <= ?", params[:max_lat])
                         .where(showOnMap: TRUE).limit(50)
      
      render json: @requests.as_json( 
                   include: { user: { only: [:id,:first_name,:last_name] }, 
                   responder: { only: [:id,:user_id]}}, 
                   only: [:id,:user_id, :description, :rtype,:lat, :lng, :created_at])
    end

    if params[:responderID]
      sql = "SELECT 
      requests.id AS request_id,
      users.first_name,
      users.last_name,
      requests.description,
      requests.user_id AS request_user_id,
      responders.user_id AS responder_user_id,
      responders.id AS responder_id,
      COALESCE(COUNT( (conversations.user_id = requests.user_id AND conversations.unreaded = TRUE ) OR NULL),0)
      AS unreaded_message_count
      FROM requests 
      LEFT OUTER JOIN users ON users.id = requests.user_id 
      LEFT OUTER JOIN responders ON responders.request_id = requests.id 
      LEFT OUTER JOIN conversations ON conversations.responder_id = responders.id
      WHERE responders.user_id = #{params[:responderID]}
      GROUP BY requests.id,users.first_name,users.last_name,requests.description
      ,requests.user_id,responders.user_id,responders.id"
      @requests = ActiveRecord::Base.connection.execute(sql)
      render json: @requests
      #@requests = Request.includes(:user, :responder).where(responders: { user_id: params[:responderID] })
      #render json: @requests.as_json( include: { user: { only: [:id,:first_name,:last_name] }, responder: { only: [:id,:user_id]}}, only: [:id,:user_id, :description], :methods => :unreaded_message_count)
    end

    if params[:unfullfilled]
      @requests = Request.where(fullfilled: false)
      render json: @requests
    end
  end

  def show
    @request = Request.find(params[:id])
    render json: @request
  end

  def create
    @request = Request.new(create_params)
    if @request.save
      render json: @request, status: :created, location: @request
    else
      Rails.logger.info(@request.errors.messages.inspect)
      render json: @request.errors, status: :unprocessable_entity
    end

  end

  def update
    @request = Request.find(params[:id])
    if @request.update_attributes(fullfilled: params[:fullfilled], showOnMap: params[:showOnMap])
      render json: @request
    else      
      Rails.logger.info(@request.errors.messages.inspect)
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  private

  def search_params
    params.permit(:min_lng, :max_lng, :min_lat, :max_lat, :showOnMap,)
  end

  def create_params
    params.permit(:rtype, :description, :fullfilled, :lat, :lng, :user_id, :showOnMap)
  end
end
