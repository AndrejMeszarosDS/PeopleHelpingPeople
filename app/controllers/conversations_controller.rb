class ConversationsController < ApplicationController
  before_action :authenticate_user, only: [ :index, :create]
  
  # GET /conversations
  def index
    if params[:responder_id] and params[:user_id] and params[:partner_id]
      updated = Conversation.where(responder_id: params[:responder_id] )
                            .where(user_id: params[:partner_id])
                            .where(unreaded: TRUE)
                            .update_all("unreaded = false")
      if updated > 0
         ActionCable
           .server
             .broadcast("users_channel:#{params[:user_id]}",
                        "message sended")
         ActionCable
           .server
             .broadcast("users_channel:#{params[:partner_id]}",
                        "message sended")
      end
      @conversations = Conversation.search(params[:responder_id]).includes(:user)
    end
    render json: @conversations.to_json(include: { user: { only: [:id,:first_name,:last_name] }},:methods => :posted_on)
  end

  # POST /conversations
    def create
        @conversation = Conversation.new(conversation_params)
        if @conversation.save
            ActionCable
            .server
            .broadcast("users_channel:#{params[:partner_id]}",
                    "message sended")
            render json: @conversation, status: :created, location: @user
        else
            Rails.logger.info(@conversation.errors.messages.inspect)
            render json: @conversation.errors, status: :unprocessable_entity
        end
    end

    private

    # Only allow a trusted parameter "white list" through.
    def conversation_params
      params.permit(:responder_id, :user_id, :message, :unreaded)
    end

end
