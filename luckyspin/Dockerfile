# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the built files in `dist` to Nginx's default html directory
COPY ./dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
