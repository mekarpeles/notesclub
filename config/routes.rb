Rails.application.routes.draw do
  scope :v1, defaults: { format: :json} do
    resources :users, only: [:index, :show, :create, :update] do
      collection do
        post 'confirmation'
      end
    end
    devise_for :users, controllers: { sessions: :sessions },
                       path_names: { sign_in: :login, sign_out: :logout },
                       skip: [:confirmations], skip_helpers: [:confirmations]
    resources :topics, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get 'count'
      end
    end
    resources :waiting_users, only: [:create]
    get 'golden_tickets/check', to: 'golden_tickets#check'
    get 'ping', to: 'ping#ping'
    get 'search/count', to: 'topics#count' # Deprecated. It's used by the chrome extension. Use /topics/count
  end
end
