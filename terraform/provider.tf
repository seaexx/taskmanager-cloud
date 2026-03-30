terraform {
    required_version = ">=1.0"

    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
            version = "~> 2.34"

        }
    }
}
    provider "digitalocean" {
        # using env variables so its empty
    }