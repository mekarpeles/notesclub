Rails.application.routes.draw do
  scope :api, defaults: { format: :json} do
    devise_for :users, controllers: { sessions: :sessions },
                       path_names: { sign_in: :login, sign_out: :logout }

    # post '/users/login', to: 'sessions#create'
    # delete '/users/logout', to: 'sessions#destroy'

    resources :users, only: [:show, :update]
    resources :exercises, only: [:index, :create, :show]
  end
end
