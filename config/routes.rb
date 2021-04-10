Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  scope '/api' do
    post 'password_reset' => 'password_reset#create'
    post 'user_token' => 'user_token#create'
    resources :responders, only: [:index, :show, :create, :update]
    resources :conversations, only: [:index, :show, :create]
    resources :requests, only: [:index, :show, :create, :update]
    resources :users, only: %i[create update show index destroy] do
      get :gaID, on: :member
    end
  end
end
