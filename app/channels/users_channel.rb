class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users_channel:#{params[:userID]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
