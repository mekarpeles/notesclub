Rails.application.routes.draw do
  scope :v1, defaults: { format: :json} do
    resources :users, only: [:index, :show, :create, :update]
    devise_for :users, controllers: { sessions: :sessions },
                       path_names: { sign_in: :login, sign_out: :logout }
    resources :topics, only: [:index, :show, :create, :update, :destroy]
    resources :waiting_users, only: [:create]
    get 'golden_tickets/check', to: 'golden_tickets#check'
    get 'ping', to: 'ping#ping'
  end
end
